from flask import Flask,render_template,request,redirect,url_for,session,Response, jsonify

from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

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

load_dotenv()

MONGO_URI = os.environ.get('MONGODB_URL')
client = MongoClient(MONGO_URI)
db = client['attendance']

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    

file = open("encoded_data.p","rb")
face_embeddings = pickle.load(file)

app = Flask(__name__,template_folder="template") 
app.secret_key = os.urandom(22)

# UPLOAD_FOLDER = os.path.join('static', 'uploads')
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/print_collection', methods=['GET'])
def print_collection_data():
    # Replace 'your_collection_name' with the name of the collection you want to print
    collection = db['users']
    
    # Fetch all documents from the collection
    cursor = collection.find({})
    
    # Print the data to the console
    for document in cursor:
        print(document['name'])
    
    return "Data printed to console."
 
 

streaming= True
student_table = db['students']
attendence_table = db['attendances']
def mark_attendence(id,cl_id):
    try:
        current_day = date.today()
        for items in attendence_table:
            if(items["Date"] == current_day and items["classId"] == cl_id):
                items["studentsPresent"].append(id)
                break
        #my_cursor.execute("insert into attendence values(%s , %s, %s);",(i0d,name,current_day))
    except:
        return 
    
def video_streaming(class_id):
    face_encoder = FaceNet()
    face_detector = MTCNN()
    global capture
    url = "http://100.90.209.161:8080/video"
    capture = cv2.VideoCapture(0)
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
            if(distance[np.argmin(distance)] < 0.2):
                id = student_id[np.argmin(distance)]
                for students in student_table:
                    if(students['studentId'] == id):
                        name = students['name']
                        break
                # my_cursor.execute("select student_name from students where student_id = %s",(id,))
                # name = my_cursor.fetchone()[0]
                cv2.rectangle(image,(x1,y1),(x2,y2),(255,0,0),3)
                cv2.putText(image,name,(x1,y1),cv2.FONT_HERSHEY_TRIPLEX,2,(255, 255, 255))
                mark_attendence(id,class_id)
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

#@app.route('/attendence')
def attendence(class_id):
    return Response(video_streaming(class_id), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/stopcamera', methods=["GET",'POST'])
def stopcamera(): 
    capture.release()
    cv2.destroyAllWindows()
    # return redirect("/home")

@app.route('/api/v1/user/stopAttendance', methods=['POST'])
def stop_attendance():
    try:
        data = request.json
        class_id = data.get('classId')
        is_attendance_started = data.get('isAttendanceStarted')
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
    

# @app.route("/students_information",methods = ["POST"])
# def students_information():
#     if (request.method == "POST" and "date" in request.form):
#         date = request.form["date"]
#         my_cursor.execute("select count(student_id) from attendence where in_time = %s",(date,))
#         count = my_cursor.fetchone()[0]
#         return render_template("/post_information_last.html",students = count)
#     if request.method == 'POST' and "roll_no" in request.form:
#         student_id = request.form["roll_no"]
#         my_cursor.execute("select count(in_time) from attendence where student_id = %s",(student_id,))
#         class_attended = my_cursor.fetchone()[0]
#         info = dict()
#         my_cursor.execute("select student_name from students where student_id = %s",(student_id,))
#         name = my_cursor.fetchone()[0]
#         info["student_id"] = student_id
#         info["class_attended"] = class_attended
#         info["student_name"] = name 
#         return render_template("/post_information.html",info = info)
#     else:
#         return redirect("/home")


@app.route('/api/v1/user/startAttendance', methods=['POST'])
def attendence_starter():
    try:
        # Accessing data sent in the request body
        data = request.json  # This will contain the JSON data sent in the request body

        # Accessing specific fields from the data
        class_id = data.get('classId')
        faculty = data.get('facultyId')
        is_attendance_started = data.get('isAttendanceStarted')
        current_day = date.today()
        sample_data = {"classId":class_id,"Date":current_day,"facultyId":faculty,"studentsPresent":[],"studentsAbsent":[]}
        new_attendance = attendence_table(sample_data)
        new_attendance.save()
        attendence(class_id)
        response_data = {
            'success': True,
            'message': 'Attendance started successfully!'
            ''
        }
        return jsonify(response_data)

    except Exception as e:
        # If there is any error, you can handle it here and send an appropriate response
        response_data = {
            'success': False,
            'message': 'An error occurred while starting attendance.'
        }
        return jsonify(response_data), 500



@app.route('/api/v1/user/student-register', methods=['POST'])
def student_register():
    try:
        user_id = request.form.get('userId')
        image_file = request.files.get('image')
        content_type = request.form.get('contentType')
        embeddings = Embeddings()
        embeddings.adding_new_face(image_file,user_id)
        response_data = {
            'success': True,
            'message': 'Student registration successful!'
        }
        return jsonify(response_data)

    except Exception as e:
        # If there is any error, you can handle it here and send an appropriate response
        response_data = {
            'success': False,
            'message': 'An error occurred while registering the student.'
        }
        return jsonify(response_data), 500


if __name__ == '__main__':
    app.run(debug=True)

