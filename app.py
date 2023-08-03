import json
from flask import Flask, render_template, request, redirect, url_for, session, Response, jsonify

from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from flask_cors import CORS
from datetime import date
from bson.objectid import ObjectId  

import pickle
import cv2
import os
from keras_facenet import FaceNet
from mtcnn.mtcnn import MTCNN
import numpy as np
import mysql.connector as db_connector
from datetime import date,time
from face import Embeddings
from werkzeug.utils import secure_filename
import  base64
from PIL import Image
from io import BytesIO

load_dotenv()

#Database Connection
MONGO_URI = os.environ.get('MONGODB_URL')
client = MongoClient(MONGO_URI)
db = client['attendance']
users=db['users']
classes=db['classes']
students=db['students']
attendances = db['attendances']
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    

file = open("encoded_data.p","rb")
face_embeddings = pickle.load(file)


app = Flask(__name__,template_folder="template") 
CORS(app)
app.secret_key = os.urandom(22)


streaming= True
def mark_attendence(id,cl_id):
    id= ObjectId(id)
    cl_id= ObjectId(cl_id)
    try:
        current_day = date.today()
        current_day_str = current_day.strftime('%Y-%m-%d')
        attendence_table = attendances.find_one({"classId":cl_id,"Date":current_day_str})
        students_present = attendence_table["studentsPresent"]
        if(id not in students_present):
            attendances.find_one_and_update({"classId":cl_id,"Date":current_day_str},{"$push":{"studentsPresent":id}})
        #my_cursor.execute("insert into attendence values(%s , %s, %s);",(i0d,name,current_day))
    except:
        print(f"An error occurred in marking attendance: {e}")
        return 
    
def video_streaming(class_id):
    class_id= ObjectId(class_id)
    currClass = classes.find_one({"_id":class_id})
    joined_students = currClass["studentsJoined"]
    face_encoder = FaceNet()
    face_detector = MTCNN()
    global capture
    url = 0
    capture = cv2.VideoCapture(url)
    while streaming:
        isTrue,image = capture.read()
        if not isTrue:
            continue
        try:
            img = cv2.cvtColor(image,cv2.COLOR_BGR2RGB)
            bbox = face_detector.detect_faces(img)[0]["box"]
            x,y,w,h = bbox
            x1,y1,x2,y2 = x,y,x+w,y+h
            face = img[y1:y2,x1:x2]
            face = face.reshape(1,face.shape[0],face.shape[1],face.shape[2])
            embeddings = face_encoder.embeddings(face)
            student_id = []
            distance = []
            for id,vector in face_embeddings.items():
                student_id.append(id)
                distance.append(face_encoder.compute_distance(embeddings[0],vector[0]))
            if(distance[np.argmin(distance)] < 0.35):
                id = student_id[np.argmin(distance)]
                if(id in joined_students):
                    student = users.find_one({"_id":ObjectId(id)})
                    name=student["name"]
                            
                    # my_cursor.execute("select student_name from students where student_id = %s",(id,))
                    # name = my_cursor.fetchone()[0]
                    cv2.rectangle(image,(x1,y1),(x2,y2),(255,0,0),3)
                    cv2.putText(image,name,(x1,y1),cv2.FONT_HERSHEY_TRIPLEX,2,(255, 255, 255))
                    mark_attendence(id,class_id)
                else :
                    msg = "Student Not Present in Class!"
                    cv2.putText(image,msg,(15,460),cv2.FONT_HERSHEY_TRIPLEX,1,(255, 255, 255))
            else:
                msg = "Student Not Present in DataBase!"
                cv2.putText(image,msg,(15,460),cv2.FONT_HERSHEY_TRIPLEX,1,(255, 255, 255))
            cv2.resize(image,(224,224))
            ret,buffer = cv2.imencode(".jpg",image,[int(cv2.IMWRITE_JPEG_QUALITY), 100])
            image = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n')      
        except:
            msg = "No One Detected!"
            cv2.resize(image,(224,224))
            cv2.putText(image,msg,(150,460),cv2.FONT_HERSHEY_TRIPLEX,1,(255, 255, 255))
            ret,buffer = cv2.imencode(".jpg",image,[int(cv2.IMWRITE_JPEG_QUALITY), 50])
            image = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n')  
            continue
    capture.release()
    cv2.destroyAllWindows()


def stopcamera(): 
    capture.release()
    cv2.destroyAllWindows()

@app.route('/stopAttendance', methods=['POST', 'GET'])
def stop_attendance():
    try:
        data = request.json
        classId = data.get('classId')
        stopcamera()
        response_data = {
            'success': True,
            'message': 'Attendance stopped successfully!'
        }
        return jsonify(response_data)
    except Exception as e:
        response_data = {
            'success': False,
            'message': 'An error occurred while stopping attendance.'
        }
        return jsonify(response_data), 500


@app.route('/attendance/<classId>', methods=['POST', 'GET'])
def attendence(classId):
    return Response(video_streaming(classId), mimetype='multipart/x-mixed-replace; boundary=frame')  

@app.route('/startAttendance', methods=['POST'])
def attendence_starter():
    try:
        data = request.json  
        classId = data.get('classId')
        facultyId = data.get('facultyId')
        className = data.get('className')
        facultyName = data.get('facultyName')
        current_day = date.today()
        
        classId = ObjectId(classId)
        facultyId = ObjectId(facultyId)

        # Convert current_day to a string representation
        current_day_str = current_day.strftime('%Y-%m-%d')

        # Check if an attendance record already exists for the given classId and date
        existing_attendance = attendances.find_one({'classId': classId, 'Date': current_day_str})

        if existing_attendance:
            existing_attendance_id = existing_attendance['_id']
        else:
            new_attendance = {
                'classId': classId,
                'className': className,
                'facultyId': facultyId,
                'facultyName': facultyName,
                'Date': current_day_str,  # Use the string representation
                'studentsPresent': [],
                'studentsAbsent': []
            }
            x = attendances.insert_one(new_attendance)
            existing_attendance_id = x.inserted_id

        data = {
            'success': True,
            'message': 'Attendance started successfully!',
            'attendanceId': str(existing_attendance_id)  # Convert ObjectId to string
        }
        json_data = json.dumps(data)
        
        return redirect(f'/attendance/{classId}')

    except Exception as e:
        print(f"An error occurred in starting attendance : {e}")
        data = {
            'success': False,
            'message': 'An error occurred while starting attendance.'
        }
        return jsonify(data), 500


@app.route("/user/student-register", methods=["POST"])
def student_register():
    data = request.get_json()
    image_data_url = data.get("image")
    user_id = data.get("userId")
    studentId = data.get("studentId")
    
    user_id = ObjectId(user_id)
    
    users.update_one({"_id": user_id}, {'$set': {'isStudent': True, 'studentId': studentId}})
    # Extract the base64-encoded image data from the data URL
    _, encoded_image = image_data_url.split(",", 1)
    decoded_image = base64.b64decode(encoded_image)
    pil_image = Image.open(BytesIO(decoded_image))
    image_array = np.array(pil_image)
    embeddings = Embeddings()
    embeddings.adding_new_face(image_array, user_id)
    return jsonify({"success": True, "message": "Image received and processed successfully."})


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)