import React, { useEffect } from 'react'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { getNomineeDetailsAction } from '../../routes/financier/FinancierDuck'
import AddNomineeDetails from '../addNomineeDetails'
import Text from '../text'
import * as styles from './NomineeDetails.css'

const HeaderComponent = ({ title }) => (
  <th className={styles.tableTextView}>
    <Text bold size='0.9' color='#757474'>
      {title}
    </Text>
  </th>
)

const NomineeDetailsRow = ({ nominee }) => (
  <tr>
    <td className={styles.tableTextView}>
      <Text size='0.95'>{nominee.name}</Text>
    </td>
    <td className={styles.tableTextView}>
      <Text size='0.95'>{nominee.email}</Text>
    </td>
    <td className={styles.tableTextView}>
      <Text size='0.95'>{nominee.phone}</Text>
    </td>
    <td className={styles.tableTextView}>
      <Text size='0.95'>{nominee.pan}</Text>
    </td>
    <td className={styles.tableTextView}>
      <Text size='0.95'>{nominee.relation}</Text>
    </td>
  </tr>
)

export const NomineeDetails = ({ addNominee, setAddNominee }) => {
  const headerTitles = ['Name', 'Email', 'Phone', 'PAN', 'Relation']
  const { authAxios } = useAxios()
  const {
    financierState: { financier, nominees },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()

  useEffect(() => {
    getNomineeDetailsAction(financier?.financierPAN)(authAxios, financierDispatch)
  }, [])

  return (
    <div>
      {addNominee ? (
        <AddNomineeDetails financierPAN={financier?.financierPAN} setAddNominee={setAddNominee} />
      ) : nominees.length > 0 ? (
        <table className={styles.nomineeTable}>
          <colgroup>
            <col width='16%' />
            <col width='36%' />
            <col width='16%' />
            <col width='16%' />
            <col width='16%' />
          </colgroup>
          <tr>
            {headerTitles.map(title => (
              <HeaderComponent key={title} title={title.toUpperCase()} />
            ))}
          </tr>
          {nominees.map(nominee => (
            <NomineeDetailsRow key={nominee?.pan} nominee={nominee} />
          ))}
        </table>
      ) : (
        <Text color='#808080'>You haven&apos;t added any nominee(s) to your TradeCred account.</Text>
      )}
    </div>
  )
}
