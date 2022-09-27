import {
  createContactMutation,
  createContactMutationVariables,
} from 'types/graphql'

import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  SubmitHandler,
  TextAreaField,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/dist/toast'

const CREATE_CONTACT = gql`
  mutation createContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

interface FormValues {
  name: string
  email: string
  message: string
}

const ContactPage = () => {
  // We're no longer using the config property of <Form>
  const formMethods = useForm({ mode: 'onBlur' })
  const [create, { loading, error }] = useMutation<
    createContactMutation,
    createContactMutationVariables
  >(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Thank you for your submission!')
      formMethods.reset()
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    create({ variables: { input: data } })
    console.log(data)
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />
      <Toaster />
      {/* onBlur validates each field as soon as it's unfocused */}
      <Form onSubmit={onSubmit} error={error} formMethods={formMethods}>
        <FormError error={error} wrapperClassName="form-error" />
        {/* The label above the text field */}
        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        {/* Displayed in case the validation failed */}
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            // Regex email validation
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
