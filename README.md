# Haar Cascades FaceDetector

OpenCV imeplemntation of the famous Viola Jones algorithm named after two computer vision researchers who proposed the method in 2001, Paul Viola and Michael Jones in their paper, “Rapid Object Detection using a Boosted Cascade of Simple Features”.

It’s a machine learning algorithm for face detection that needs a lot of positive images (images of faces) and negative images (images without faces) to train the classifier. The implementation of the Viola Jones algorithm in OpenCV came with diferents classifiers, so it can be used to detect other things like eyes, hands or profile face.

## How it works
---
Given an image(this algorithm works on grayscale image), the algorithm looks at many smaller subregions and tries to find a face by looking for specific features in each subregion. It needs to check many different positions and scales because an image can contain many faces of various sizes. Viola and Jones used Haar-like features to detect faces in this algorithm.

The Viola Jones algorithm has four main steps to follow:

## 1. Selecting Haar-like features

Haar-like features are digital image features used in object recognition. They owe their name to their intuitive similarity with Haar wavelets and were used in the first real-time face detector. Paul Viola and Michael Jones adapted the idea of using Haar wavelets and developed the so-called Haar-like features.

A Haar-like feature considers adjacent rectangular regions at a specific location in a detection window, sums up the pixel intensities in each region and calculates the difference between these sums. This difference is then used to categorize subsections of an image.

## 2. Creating an integral image

An Integral image is where each pixel represents the cumulative sum of a corresponding input pixel with all pixels above and left of the input pixel. This algorithm enables rapid calculation of summations over image sub-regions. Any rectangular subset of such sub-region can be evaluated in constant time.

This concept was introduced by Viola & Jones and is also known as Summed Area Table. allow fast computation of rectangular image features since they enable the summation of image values over any rectangle image region in constant time i.e. computational complexity of O(1) instead of O(n).

## 3. Running AdaBoost training

Next, we use a Machine Learning algorithm known as AdaBoost. The number of features that are present in the 24×24 detector window is nearly 160,000, but only a few of these features are important to identify a face. So AdaBoost algorithm help to identify the best features in the 160,000 features.

In the Viola-Jones algorithm, each Haar-like feature represents a weak learner. To decide the type and size of a feature that goes into the final classifier, AdaBoost checks the performance of all classifiers that you supply to it.

To calculate the performance of a classifier, you evaluate it on all subregions of all the images used for training. Some subregions will produce a strong response in the classifier. Those will be classified as positives, meaning the classifier thinks it contains a human face. Subregions that don’t provide a strong response don’t contain a human face, in the classifiers opinion. They will be classified as negatives.

The classifiers that performed well are given higher importance or weight. The final result is a strong classifier, also called a boosted classifier, that contains the best performing weak classifiers.

So when we’re training the AdaBoost to identify important features, we’re feeding it information in the form of training data and subsequently training it to learn from the information to predict. So ultimately, the algorithm is setting a minimum threshold to determine whether something can be classified as a useful feature or not.

## 4. Creating classifier cascades

Maybe the AdaBoost will finally select the best features around say 2500, but it is still a time-consuming process to calculate these features for each region. We have a 24×24 window which we slide over the input image, and we need to find if any of those regions contain the face. The job of the cascade is to quickly discard non-faces, and avoid wasting precious time and computations. Thus, achieving the speed necessary for real-time face detection.

We set up a cascaded system in which we divide the process of identifying a face into multiple stages. In the first stage, we have a classifier which is made up of our best features, in other words, in the first stage, the subregion passes through the best features such as the feature which identifies the nose bridge or the one that identifies the eyes. In the next stages, we have all the remaining features.

When an image subregion enters the cascade, it is evaluated by the first stage. If that stage evaluates the subregion as positive, meaning that it thinks it’s a face, the output of the stage is maybe. When a subregion gets a maybe, it is sent to the next stage of the cascade and the process continues as such till we reach the last stage. If all classifiers approve the image, it is finally classified as a human face and is presented to the user as a detection.

Now how does it help us to increase our speed? Basically, If the first stage gives a negative evaluation, then the image is immediately discarded as not containing a human face. If it passes the first stage but fails the second stage, it is discarded as well. Basically, the image can get discarded at any stage of the classifier.

DEMO

---

[Face-Detector Live-Demo](https://haarcascades-facedetector.web.app/).

Tools

---

Key tools used in this React project are:

- React
- CRA
- OpenCV
- WEB API
- Haar Cascade Classifier
- webassembly
- Face model Classifier

Installation

---

Execute the following command on your terminal to install all the needed packages:

    npm install

Start the React App:

    npm run start

The application will start automatically in your browser on http://localhost:8080/

To Build the project to a production mode execute:

    npm run build

Copyright and license

---

The MIT License (MIT). Please see License File for more information.

References

---
https://en.wikipedia.org/wiki/Haar-like_feature#:~:text=A%20Haar%2Dlike%20feature%20considers,categorize%20subsections%20of%20an%20image.

https://nayan.co/blog/AI/Integral-Image/

https://www.mygreatlearning.com/blog/viola-jones-algorithm/
