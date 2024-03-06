import React, {ReactElement} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

export default function Modal({triggerElement, children}: { triggerElement: ReactElement, children: ReactElement }) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {triggerElement}
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay"/>

                <Dialog.Content className="DialogContent">
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </Dialog.Close>

                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
