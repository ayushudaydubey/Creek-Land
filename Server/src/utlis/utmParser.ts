export const parseUTM = (query: any) => {
  return {
    source: query.utm_source,
    medium: query.utm_medium,
    campaign: query.utm_campaign,
    content: query.utm_content
  }
}