import React from "react";
import '../assets/css/Modal.scss';

const DeathModal = ({ confirm, deny, killer }) => {
    return (
        <>
            <div class="darkBG" />
            <div class="centered">
                <div class="modal">
                    <div class="modalHeader">
                        <h5 class="heading">You have died!</h5>
                    </div>
                    <div class="modalContent">
                        Our records indicate that you have been assassinated by {killer}! You will not be able to continue to play until you confirm or deny this.
                    </div>
                    <div class="modalActions">
                        <div class="actionsContainer">
                            <button class="deletebtn" onClick={confirm}>
                                Confirm
                            </button>
                            <button
                                class="cancelbtnS"
                                onClick={deny}
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeathModal;
