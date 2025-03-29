const db = useDrizzle()

export const getOrgLeadsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
    .select({ createdAt: leadSchema.createdAt })
    .from(leadSchema)
    .where(
      and(
      ...(fromDate && toDate ? [
        gte(leadSchema.createdAt, fromDate),
        lte(leadSchema.createdAt, toDate),
      ] : []),
        eq(leadSchema.organizationId, organizationId),
    ),
  )
}

export const getOrgQualifiedLeads = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, highPotential?: boolean) => {
  let data: any = await db
    .select({ createdAt: leadSchema.createdAt, metadata: leadSchema.metadata })
    .from(leadSchema)
    .where(
      and(
      ...(fromDate && toDate ? [
        gte(leadSchema.createdAt, fromDate),
        lte(leadSchema.createdAt, toDate),
      ] : []),
        eq(leadSchema.organizationId, organizationId),
        isNotNull(leadSchema.metadata),
    )
  )

  data = data.filter((lead: any) => {
    // Ensure lead and its nested properties exist before accessing
    const metadata: any = lead.metadata || {};
    const leadClassification = metadata.leadClassification
    const metrics = metadata.metrics || {};
    const buyerSignals = metadata.buyerSignals || [];
    const finalScore = metadata.finalScore || 0;
    
    // High Potential Leads (only classification check)
    if(highPotential) {
      return (leadClassification === "Warm Lead" || leadClassification === "Hot Lead") 
    }
    
    // Correctly Identified Leads (stricter conditions)
    return (
      (leadClassification === "Warm Lead" || leadClassification === "Hot Lead") &&
      metrics.contactRequestsCount > 0 &&
      buyerSignals.length > 0 &&
      finalScore >= 70
    );
  })
  return data.length || 0
}

export const getLeadComposition = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data: any = await db
    .select({ createdAt: leadSchema.createdAt, metadata: leadSchema.metadata, status: leadSchema.status })
    .from(leadSchema)
    .where(
      and(
      ...(fromDate && toDate ? [
        gte(leadSchema.createdAt, fromDate),
        lte(leadSchema.createdAt, toDate),
      ] : []),
        eq(leadSchema.organizationId, organizationId),
        isNotNull(leadSchema.metadata),
    )
  )

  const leadCounts = data.reduce( (acc: any, lead: any) => {
    const leadClassification = lead.metadata?.leadClassification || ""
    if (leadClassification === "Warm Lead") acc.warmLeads++;
    else if (leadClassification === "Hot Lead") acc.hotLeads++;
    else if (leadClassification === "Cold Lead") acc.coldLeads++;
    else if (lead.status === "junk") acc.junkLeads++;

    return acc;
  },
  { warmLeads: 0, hotLeads: 0, coldLeads: 0, junkLeads: 0 });

  return leadCounts
}