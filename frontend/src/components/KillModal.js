import React from "react";
import '../assets/css/Modal.scss';

const KillModal = ({ exit, confirm, handleChangeMessage, message, targetAlias, targetName }) => {
    return (
        <>
            <div class="darkBG" onClick={exit} />
            <div class="centered">
                <div class="modal">
                    <div class="modalHeader">
                        <h5 class="heading">Kill {targetAlias}</h5>
                    </div>
                    <div class="modalContent">
                        Are you sure you killed {targetName}, a.k.a. {targetAlias}? <br></br>

                        <div class="iflarge">
                            The kill will be pending while {targetName} confirms it, so be patient and don't press the button again.<br></br>
                        </div>
                    </div>
                    <div class="modalActions">
                        <div class="actionsContainer">
                            <form onSubmit={confirm}>
                                <input
                                    id="message"
                                    type="text"
                                    value={message}
                                    placeholder="How did you kill them?"
                                    onChange={handleChangeMessage}
                                />
                                <input type="submit" value="Assassinate" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KillModal;
