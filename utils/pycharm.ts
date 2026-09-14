/**
 * Where the course sends students for PyCharm. One place to change it: the QR
 * code, the link and the install walk-through all read from here.
 */
export const PYCHARM = {
  /** What the QR code opens. */
  href: 'https://www.jetbrains.com/pycharm/download/',
  /** What the address bar and the link on the slide show. */
  display: 'jetbrains.com/pycharm/download',
  /** The breadcrumb line of the search result in the walk-through. */
  crumbs: 'jetbrains.com › pycharm › download',
  /** The file the walk-through downloads. */
  file: 'pycharm-community.exe',
}

/** Where students whose PyCharm finds no Python get it. */
export const PYTHON = {
  href: 'https://www.python.org/downloads/',
  display: 'python.org/downloads',
}
