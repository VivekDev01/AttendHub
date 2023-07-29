import cv2
import os
from keras_facenet import FaceNet
from mtcnn.mtcnn import MTCNN
import pickle
import numpy as np

file = open("encoded_data.p", "rb")
encoding_faces = pickle.load(file)
print(encoding_faces.keys())