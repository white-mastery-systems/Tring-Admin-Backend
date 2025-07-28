const db = useDrizzle()

export const getOrgChatLeadsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data = await db
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
  return data.length
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
    const leadClassification = metadata?.overallAssessment?.leadClassification
    const interestIndicators = metadata.interestIndicators || {};
    const buyerSignals = metadata?.qualitativeFeedback?.expressions || [];
    const finalScore = metadata?.overallAssessment?.finalScore || 0;
    
    // High Potential Leads (only classification check)
    if(highPotential) {
      return (leadClassification === "warm" || leadClassification === "hot") 
    }
    
    // Correctly Identified Leads (stricter conditions)
    return (
      (leadClassification === "warm" || leadClassification === "hot") &&
      interestIndicators?.contactRequests > 0 &&
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
    const leadClassification = lead.metadata?.overallAssessment?.leadClassification || ""
    if (leadClassification === "warm") acc.warmLeads++;
    else if (leadClassification === "hot") acc.hotLeads++;
    else if (leadClassification === "cold") acc.coldLeads++;
    else if (lead.status === "junk") acc.junkLeads++;

    return acc;
  },
  { warmLeads: 0, hotLeads: 0, coldLeads: 0, junkLeads: 0 });

  return leadCounts
}

export const getChatDropOffConversation = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => { 
  let data: any = await db
    .select() 
    .from(leadSchema)
    .where(
      and(
        ...(fromDate && toDate ? [
          gte(leadSchema.createdAt, fromDate),
          lte(leadSchema.createdAt, toDate),
        ] : []),
        eq(leadSchema.organizationId, organizationId),
        isNotNull(leadSchema.metadata),
      ),  
  )

  data = data.filter((lead: any) => { 
    const metadata: any = lead.metadata || {};
    const behavioralMetrics = metadata.behavioralMetrics || {};
    return (
      behavioralMetrics.dropOffRate === true
    );
  })

  return data.length
}
