export default {
  // Page text
  'title': '플랫폼 뉴스 & 공지사항',
  'noData': '현재 사용 가능한 공지사항이 없습니다.',
  
  // Filters
  'filter.all': '모든 공지사항',
  'filter.feature': '기능',
  'filter.update': '업데이트',
  'filter.maintenance': '유지보수',
  
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
  'post.beta.title': 'Pi.Sale 플랫폼 베타 릴리스',
  'post.beta.content': 'Pi.Sale 플랫폼 베타 버전이 공식적으로 출시되었습니다. 이 버전은 테스트 목적으로만 사용되며, 표시된 모든 데이터는 실제 조건을 나타내지 않는 시뮬레이션된 데모입니다.\n\n사용자는 플랫폼 기능을 탐색하고 피드백을 제공하여 사용자 경험을 개선하는 데 도움을 줄 수 있습니다.',
  
  'post.mint.title': '민팅 프로세스 최적화',
  'post.mint.content': 'Pi.Sale 플랫폼 민팅 기능이 여러 기술적 최적화를 완료했습니다:\n\n- 토큰 생성 프로세스 간소화\n- 향상된 커스터마이징 옵션\n- 개선된 오류 처리 메커니즘\n- 가속화된 트랜잭션 처리\n\n이러한 최적화는 플랫폼 효율성과 사용자 경험을 향상시키는 것을 목표로 합니다.',
  
  'post.maintain.title': '시스템 유지보수 공지',
  'post.maintain.content': 'Pi.Sale 플랫폼은 서비스 성능과 안정성을 향상시키기 위해 시스템 유지보수를 진행할 예정입니다.\n\n유지보수 기간 동안 플랫폼 서비스가 잠시 중단될 수 있습니다. 불편을 끼쳐 드려 죄송합니다.\n\n유지보수 일정: 2025년 4월 15일, UTC 2:00-5:00.',
}; 