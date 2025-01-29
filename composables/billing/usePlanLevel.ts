
export const usePlanLevel = () => {
  const findPlanLevel = ({
    list,
    current,
  }: {
    list: { plan_code: string };
    current: string;
  }) => {
    if (list.plan_code === "chat_enterprise") {
      return "Contact sales";
    } else if (list.plan_code === 'chat_free') {
      return "N/A";
    } else {
      return "Subscribe";
    }
    // Additional logic can be implemented if needed
    // e.g., comparing plan levels for upgrade/downgrade.
  };

  return { findPlanLevel };
};
