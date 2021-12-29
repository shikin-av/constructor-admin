export const LANG = {
  ENG: 'en',
  RUS: 'ru',
}

window.lang = LANG.RUS

const TEXTS = {
  HEADER: {
    TITLE: {
      [LANG.ENG]: 'Constructor',
      [LANG.RUS]: 'Конструктор',
    },
  },
  MAIN_MENU: {
    HOME: {
      [LANG.ENG]: 'Home',
      [LANG.RUS]: 'Главная',
    },
    STEPS: {
      [LANG.ENG]: 'Story Steps',
      [LANG.RUS]: 'История',
    },
    MANAGERS: {
      [LANG.ENG]: 'Managers',
      [LANG.RUS]: 'Менеджеры',
    },
  },
  ERROR: {
    UNAUTHORIZED: {
      [LANG.ENG]: "You don't have enough rights",
      [LANG.RUS]: 'У Вас недостаточно прав для просмотра',
    },
  },
  AUTH: {
    LOGIN_BUTTON: {
      [LANG.ENG]: 'login',
      [LANG.RUS]: 'Вход',
    },
    TITLE: {
      [LANG.ENG]: 'Sign In',
      [LANG.RUS]: 'Вход',
    },
    EMAIL_INPUT: {
      [LANG.ENG]: 'Email',
      [LANG.RUS]: 'Почта',
    },
    EMAIL_PLACEHOLDER: {
      [LANG.ENG]: 'Please input your email',
      [LANG.RUS]: 'Введите свой email',
    },
    PASSWORD_INPUT: {
      [LANG.ENG]: 'Password',
      [LANG.RUS]: 'Пароль',
    },
    PASSWORD_PLACEHOLDER: {
      [LANG.ENG]: 'Please input your password',
      [LANG.RUS]: 'Введите свой пароль',
    },
  },
  HOME: {
    TITLE: {
      [LANG.ENG]: 'Home',
      [LANG.RUS]: 'Главная',
    },
  },
  STEPS: {
    TITLE: {
      [LANG.ENG]: 'Story Steps',
      [LANG.RUS]: 'Этапы истории',
    },
  },
  MANAGERS: {
    TITLE: {
      [LANG.ENG]: 'Managers',
      [LANG.RUS]: 'Управление менеджерами',
    },
  },
}

export default {
  HEADER: {
    TITLE: TEXTS.HEADER.TITLE[window.lang],
  },
  MAIN_MENU: {
    HOME: TEXTS.MAIN_MENU.HOME[window.lang],
    STEPS: TEXTS.MAIN_MENU.STEPS[window.lang],
    MANAGERS: TEXTS.MAIN_MENU.MANAGERS[window.lang],
  },
  ERROR: {
    UNAUTHORIZED: TEXTS.ERROR.UNAUTHORIZED[window.lang],
  },
  AUTH: {
    LOGIN_BUTTON: TEXTS.AUTH.LOGIN_BUTTON[window.lang],
    TITLE: TEXTS.AUTH.TITLE[window.lang],
    EMAIL_INPUT: TEXTS.AUTH.EMAIL_INPUT[window.lang],
    EMAIL_PLACEHOLDER: TEXTS.AUTH.EMAIL_PLACEHOLDER[window.lang],
    PASSWORD_INPUT: TEXTS.AUTH.PASSWORD_INPUT[window.lang],
    PASSWORD_PLACEHOLDER: TEXTS.AUTH.PASSWORD_PLACEHOLDER[window.lang],
  },
  HOME: {
    TITLE: TEXTS.HOME.TITLE[window.lang],
  },
  STEPS: {
    TITLE: TEXTS.STEPS.TITLE[window.lang],
  },
  MANAGERS: {
    TITLE: TEXTS.MANAGERS.TITLE[window.lang],
  },
}