import React, {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useFormikContext } from 'formik'

import { Avatar } from 'components/common/avatar/Avatar'

type UploadAvatarButtonProps = {
  fieldName: string
  imgUrl?: string | null
  setFieldValue: (name: string, value: any) => void
}

export const UploadAvatarButton = ({
  fieldName,
  imgUrl,
  setFieldValue,
}: UploadAvatarButtonProps) => {
  const { submitForm } = useFormikContext()
  const inputFile: MutableRefObject<null> = useRef(null)
  const [img, setImg] = useState(imgUrl)

  useEffect(() => {
    if (!imgUrl) {
      return
    }
    setImg(imgUrl)
  }, [imgUrl])

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.currentTarget && event.currentTarget.files) {
      const file = event.currentTarget.files[0]

      setFieldValue(fieldName, file)
      setImg(URL.createObjectURL(file))

      submitForm()
    }
  }

  return (
    <>
      <label ref={inputFile} className="upload-avatar-button">
        <Avatar img={img} avatarType={'upload'} />
        <input
          className="hidden"
          id={fieldName}
          name={fieldName}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          ref={inputFile}
        />
      </label>
    </>
  )
}
