import React from 'react'
import { Typography } from 'components/common/Typography'
import {
  PersonalInfoForm,
  ChangePasswordForm,
  DeleteAccountForm,
} from 'components/settings'
import WalletLimitsForm from 'components/settings/WalletLimitsForm'

const Settings: React.FC = () => {
  return (
    <>
      <Typography type={'h2'}>Account Information</Typography>
      <Typography type={'Ag-14-regular'}>
        Update your account information
      </Typography>
      <div className="flex flex-col sm:p-10 gap-5">
        <PersonalInfoForm />
        <ChangePasswordForm />
        <DeleteAccountForm />
        <WalletLimitsForm />
      </div>
    </>
  )
}

export default Settings
