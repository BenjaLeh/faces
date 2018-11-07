const configService = {
  menu: [
    { icon: 'home', href: '/', text: 'Inicio', active: true },
    { icon: 'home', href: '/detection', text: 'Detección' },
    { icon: 'home', href: '/gallery', text: 'Gallery' },
    { icon: 'home', href: '/recognize', text: 'Recognize' },
    {
      icon: 'keyboard_arrow_up',
      'icon-alt': 'keyboard_arrow_down',
      text: 'Sección 1',
      model: true,
      children: [
        { icon: 'add', href: '/revisiones', text: 'Create label' }
      ]
    },
    {
      icon: 'keyboard_arrow_up',
      'icon-alt': 'keyboard_arrow_down',
      text: 'More',
      model: false,
      children: [
        { icon: 'add', href: '/revisiones', text: 'Create label' },
        { icon: 'add', href: '/revisiones', text: 'Label' }
      ]
    },
    { icon: 'settings', text: 'Settings' }
  ]
}

export default configService
