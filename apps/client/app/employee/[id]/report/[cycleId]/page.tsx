import { apolloClient } from '@/lib/client'
import '../../../../global.css'
import { GET_REPORT_FOR_EMPLOYEE, GET_USER_FULLNAME_BY_ID } from '@/lib/queries'


async function Report({ params }) {

  const variables = { targetId: params.id, cycleId: params.cycleId }

  const { data: { getUser: { fullName } } } = await apolloClient.query({ query: GET_USER_FULLNAME_BY_ID, variables: { id: params.id } })
  const { data: { getReport } } = await apolloClient.query({ query: GET_REPORT_FOR_EMPLOYEE, variables })

  return (
    <div className='p-4'>

      <h1 className="text-2xl">Your Report {fullName}</h1>
      <div>
        <p>Remarks:</p>
        <p>{getReport.summary}</p>
      </div>
    </div >
  )
}

export default Report
