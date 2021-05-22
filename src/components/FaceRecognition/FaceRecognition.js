import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  const faces = box.map((data, index) => {
  	return <div key={index}  className='bounding-box' style={{top: data.topRow, right: data.rightCol, bottom: data.bottomRow, left: data.leftCol}}></div>
  })
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
        { faces }
      </div>
    </div>
  );
}

export default FaceRecognition;