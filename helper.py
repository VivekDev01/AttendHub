import cv2
import os
from keras_facenet import FaceNet
from mtcnn.mtcnn import MTCNN
import pickle
import numpy as np
from bson.objectid import ObjectId  


file = open("encoded_data.p", "rb")
encoding_faces = pickle.load(file)
print(encoding_faces.keys())
# encoding_faces.pop(ObjectId('64c281ea7d0faca6dbcb7dec'))
# file = open("encoded_data.p", "wb")
# pickle.dump(encoding_faces, file)
# print(encoding_faces.keys())
# # encoding_faces.pop("ObjectId('64c281ea7d0faca6dbcb7dec')")    
