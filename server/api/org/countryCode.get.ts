import { getPhoneLengthByCountry } from "~/server/utils/phonenumberLength"

export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
   orgId: z.string()
  }))

  const orgUserDetails = await getAdminByOrgId(query.orgId)

  return {
    countryCode: orgUserDetails?.countryCode,
    phonenumberLength: orgUserDetails?.countryCode && getPhoneLengthByCountry(orgUserDetails?.countryCode?.slice(1))
  } 
})