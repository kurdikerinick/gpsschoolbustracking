import React from 'react';

const ToastMessage = ({ message }) => {
  return (
    <div className="toast-message">
      <p>{message}</p>
    </div>
  );
};

export default ToastMessage;
