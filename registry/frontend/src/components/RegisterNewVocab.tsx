import React, {ChangeEvent, FormEventHandler, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MDEditor from '@uiw/react-md-editor';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FieldErrors, useForm, UseFormRegister, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import Modal from '../misc/Modal.js';

interface NewVocabInputs {
    title: string;
    homepage: string;
    description: string;
}

enum FormSubmissionState {
    INITIAL, WAITING, SUCCESS, FAILED
}

export default function RegisterNewVocab() {
    return (
        <Modal triggerElement={<button className="hcButton">Register new vocabulary</button>}>
            <RegisterNewVocabModalContent/>
        </Modal>
    );
}

function RegisterNewVocabModalContent() {
    const [state, setState] = useState<FormSubmissionState>(FormSubmissionState.INITIAL);
    const {
        register,
        formState: {errors},
        watch,
        setValue,
        handleSubmit
    } = useForm<NewVocabInputs>();

    async function onSubmit(data: NewVocabInputs) {
        setState(FormSubmissionState.WAITING);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('homepage', data.homepage);
        formData.append('description', data.description);

        const result = await fetch('/vocab/new', {
            method: 'POST',
            body: formData,
        });

        setState(result.ok ? FormSubmissionState.SUCCESS : FormSubmissionState.FAILED);
    }

    return (
        <>
            {[FormSubmissionState.INITIAL, FormSubmissionState.WAITING].includes(state) &&
                <RegisterNewVocabForm isDisabled={state === FormSubmissionState.WAITING}
                                      register={register} errors={errors} watch={watch} setValue={setValue}
                                      onSubmit={handleSubmit(onSubmit)}/>}
            {[FormSubmissionState.SUCCESS, FormSubmissionState.FAILED].includes(state) &&
                <Result success={state === FormSubmissionState.SUCCESS}/>}
        </>
    );
}

function RegisterNewVocabForm({isDisabled, register, errors, watch, setValue, onSubmit}: {
    isDisabled: boolean,
    register: UseFormRegister<NewVocabInputs>,
    errors: FieldErrors<NewVocabInputs>,
    watch: UseFormWatch<NewVocabInputs>,
    setValue: UseFormSetValue<NewVocabInputs>,
    onSubmit: FormEventHandler
}) {
    const descriptionRegister = register('description', {required: true});

    return (
        <>
            <Dialog.Title className="DialogTitle">Register a new vocabulary</Dialog.Title>

            <Dialog.Description className="DialogDescription">
                Fill out the details of the vocabulary. Click submit when you're done.
            </Dialog.Description>

            <form onSubmit={onSubmit}>
                <fieldset disabled={isDisabled}>
                    <label className={errors.title ? 'error' : ''}>
                        Title
                        <input {...register('title', {required: true})}
                               type="text" placeholder="The title of the vocabulary"/>
                    </label>

                    <label className={errors.homepage ? 'error' : ''}>
                        Homepage
                        <input {...register('homepage', {required: true})}
                               type="text" placeholder="The homepage of the vocabulary"/>
                    </label>

                    <label className={errors.description ? 'error' : ''}>
                        Description
                        <MDEditor className="mdEditor" value={watch('description')} onBlur={descriptionRegister.onBlur}
                                  onChange={(description, event) => {
                                      setValue('description', description || '');
                                      descriptionRegister.onChange(event as ChangeEvent);
                                  }}/>
                    </label>

                    <div className="center">
                        <button type="submit" className="hcButton">
                            Submit
                        </button>
                    </div>
                </fieldset>
            </form>
        </>
    );
}

function Result({success}: { success: boolean }) {
    return (
        <div className="center">
            <FontAwesomeIcon icon={success ? faCheck : faTriangleExclamation} size="4x"
                             className={success ? 'success' : 'failure'}/>

            <Dialog.Description className="DialogDescription">
                {success ? 'Your vocabulary has been submitted!' : 'Something went wrong, please try again later!'}
            </Dialog.Description>
        </div>
    );
}
