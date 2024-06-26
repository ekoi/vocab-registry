import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css'
import {Text, TextArea} from "@radix-ui/themes";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

const ReportAbuse = ({url_target}: {url_target: string}) =>{
const [open, setOpen] = React.useState(false);

    return (
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      <button className="Button">Report Abuse</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
         <form
            onSubmit={async (event) => {
                const data = Object.fromEntries(new FormData(event.currentTarget));
                let subject = ""
                if (data["abuse"]=='on') {
                    subject = "Abuse or Inappropriate content. "
                }
                if (data["copyright"]=='on') {
                    subject = subject + "Copyright Issue. "
                }
                if (data["illegal"]=='on') {
                    subject = subject + "Illegal Content. "
                }
                // alert(subject)
                let result = await fetch(url_target, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        "user": "eko",
                        "mail": data["email"],
                        "text": data["text"],
                        "subject": subject

                    })


                }).then(response => {
                    console.log(response.status)
                })

                event.preventDefault();
            }}
          >
            {/** some inputs */}




        <Dialog.Title className="DialogTitle">Report Abuse or Inappropriate Content</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Report Abuse or Inappropriate Content.
          In case of abuse or inappropriate content is found, please inform site owners via this form.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input className="Input" name="name" id="name" defaultValue="Fill in from user login" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="email">
            email
          </label>
          <input className="Input" name="email" id="email" defaultValue="email@login" />
        </fieldset>
         <h4>
            Type of abuse
          </h4>


         <CustomCheckbox label="Abuse or Inappropriate content" id="abuse" />
         <CustomCheckbox label="Copyrighted material" id="copyright" />
         <CustomCheckbox label="Illegal Content" id="illegal" />

        <fieldset className="Fieldset">
          <label className="Label" htmlFor="email">
            Why is the content inappropriate?
          </label>
          <TextArea color="blue" variant="soft" name="text" placeholder="" rows={10} cols={32} />
        </fieldset>
          <Text></Text>

        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <button type="submit" className="Button green">Submit</button>
        </div>

          </form>
        <Dialog.Close asChild>

          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>

      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)};

export default ReportAbuse;

const CustomCheckbox = ({label, id}: {label:string, id: string}) => {
    return (
        <div>
          <div style={{ display: 'flex'}}>
      <Checkbox.Root className="CheckboxRoot" name={id} id={id}>
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
              <label className="Label" htmlFor={id} style={{width: 'auto', marginLeft: '10px'}}>
            {label}
          </label>
              </div>
              </div>
    )
}