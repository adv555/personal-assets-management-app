import { AppRoute } from 'common/enums/app-route.enum'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import React from 'react'
import { GrStatusGood } from 'react-icons/gr'
import { Link, useNavigate } from 'react-router-dom'

/*eslint-disable */

const ChangedSuccessfully = () => {
  const navidate = useNavigate()
  const goHome = () => {
    navidate(AppRoute.HOME)

    location.reload()
  }
  return (
    <div className="flex flex-col	gap-3	items-center justify-center">
      <Typography type={'h1'} children={'Password successfully changed!'} />
      <GrStatusGood size={40} color={'green'} />

      <Button
        type={'button'}
        btnName={'primary'}
        label={'Go Home'}
        onClick={() => goHome()}
      />
    </div>
  )
}
/*eslint-enable */

export default ChangedSuccessfully
