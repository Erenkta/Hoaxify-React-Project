import React from "react";


const ButtonWithProgress = (props) => {
    const { onClick, call, text, disabled } = props;
    return (
        <button className="btn btn-primary" onClick={onClick} disabled={disabled}>
            {call && <span className="spinner-border spinner-border-sm"></span>} {text}
        </button>
    );
};

export default ButtonWithProgress;