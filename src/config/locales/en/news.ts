export default {
  // Page text
  'title': 'Platform News & Announcements',
  'noData': 'No announcements available at this time.',
  
  // Filters
  'filter.all': 'All Announcements',
  'filter.feature': 'Features',
  'filter.update': 'Updates',
  'filter.maintenance': 'Maintenance',
  
  // Tags (can reuse filter text)
  
  // Announcement data
  'data': JSON.stringify([
    {
      id: '001',
      date: '2025-04-10',
      type: 'feature',
      titleKey: 'post.beta.title',
      contentKey: 'post.beta.content'
    },
    {
      id: '002',
      date: '2025-04-05',
      type: 'update',
      titleKey: 'post.mint.title',
      contentKey: 'post.mint.content'
    },
    {
      id: '003',
      date: '2025-04-01',
      type: 'maintenance',
      titleKey: 'post.maintain.title',
      contentKey: 'post.maintain.content'
    }
  ]),
  
  // Announcement contents
  'post.beta.title': 'Pi.Sale Platform Beta Release',
  'post.beta.content': 'Pi.Sale Platform Beta version has been officially released. This version is for testing purposes only, and all data displayed are simulated demonstrations, not representing actual conditions.\n\nUsers can explore platform features and provide feedback to help improve the user experience.',
  
  'post.mint.title': 'Minting Process Optimization',
  'post.mint.content': 'Pi.Sale platform minting functionality has completed several technical optimizations:\n\n- Simplified token creation process\n- Enhanced customization options\n- Improved error handling mechanisms\n- Accelerated transaction processing\n\nThese optimizations aim to increase platform efficiency and user experience.',
  
  'post.maintain.title': 'System Maintenance Notice',
  'post.maintain.content': 'Pi.Sale platform will undergo system maintenance to enhance service performance and stability.\n\nDuring the maintenance period, platform services may experience brief interruptions. We apologize for any inconvenience this may cause.\n\nMaintenance schedule: April 15, 2025, UTC 2:00-5:00.',
}; 