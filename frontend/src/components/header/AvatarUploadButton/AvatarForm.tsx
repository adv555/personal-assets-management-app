import React from 'react'
import { Formik, Form, Field } from 'formik'
import { UploadAvatarButton } from './AvatarButton'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { updateUserAvatarProfile } from 'redux/slice/userProfile/actionCreators'

export const AvatarForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const fieldName = 'file'

  const userProfile = useAppSelector((state) => state.userProfile)

  const onSubmit = async (values: any) => {
    const formData = new FormData()

    formData.append(fieldName, values[fieldName])

    dispatch(updateUserAvatarProfile(formData))
  }

  return (
    <>
      <Formik initialValues={{ file: null }} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          return (
            <Form>
              <Field
                id={fieldName}
                name={fieldName}
                fieldName={fieldName}
                setFieldValue={setFieldValue}
                component={UploadAvatarButton}
                imgUrl={userProfile.avatarPath}
              />
              <button type="submit" className="hidden" />
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
