import React, { useState } from 'react';
import styled from 'styled-components';

const ZoomImage = (props) => {
  const [open, setopen] = useState(false);
  const handleImageZoom = () => {
    setopen(!open);
  };
  return (
    <>
      <Image {...props} onClick={handleImageZoom} />
      {open && (
      <ZoomInContainer>
        <img {...props} width='auto' height='auto' onClick={handleImageZoom} />
      </ZoomInContainer>
      )}
    </>
  );
};

export default ZoomImage;

const Image = styled.img`
  cursor: zoom-in;
`;
const ZoomInContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index:20;
  background-color: rgba(255, 255, 255, 0.95);
  max-height: 100vh;
  width: 100%;
  text-align: center;
  img {
    object-fit: contain;
    vertical-align: middle;
    max-width: 100%;
    max-height: 90vh;
    cursor: zoom-out;
  }
`;