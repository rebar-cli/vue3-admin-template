/**
 * 判断url是否是http或https
 * @param {string} path
 * @returns {Boolean}
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1;
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

/**
 * 判断字符是否在键盘上连续，包括正反横向、正反纵向
 * @param {String} string 字符
 * @param {Number} max 最大连续字符
 * @returns 是否连续
 */
export function isContinuousKeyCode(string, max = 3) {
  /**
   * 获取单个字符在键盘上的坐标
   * @param {String} char 单个字符
   * @returns { x, y, char }
   */
  function _getPos(char) {
    for (let x = 0; x < keycodeMap.length; x++) {
      for (let y = 0; y < keycodeMap[x].length; y++) {
        if (keycodeMap[x][y] === char) {
          return {
            x,
            y,
            char
          };
        }
      }
    }
    return {
      x: void 0,
      y: void 0,
      char
    };
  }

  /**
   * 将拥有合法坐标的字符设置为第一个点
   */
  function _setLegalLast() {
    ++index;
    const { x, y } = stringArr[index];
    if (x === void 0 || y === void 0) {
      _setLegalLast();
    } else {
      firstX = x;
      firstY = y;
    }
    index++;
  }
  const keycodeStr = ['1234567890', 'qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./'];
  const keycodeMap = keycodeStr.map(item => item.split(''));
  const stringArr = string
    .toLowerCase()
    .split('')
    .map(char => _getPos(char));

  let flag = 1; // 当前连续位数
  let firstX = stringArr[0].x; // 第一个连续字符的x
  let firstY = stringArr[0].y; // 第一个连续字符的y
  let index = 1; // 当前字符的索引
  let direction = ''; // 当前方向

  while (index < stringArr.length - 1) {
    const { x, y } = stringArr[index];
    if (x === void 0 || y === void 0) {
      if (index < stringArr.length - max) {
        _setLegalLast();
        flag = 1;
        continue;
      } else {
        break;
      }
    }

    switch (direction) {
      case 'left':
        if (firstY - 1 === y) {
          flag++;
        } else {
          firstX = x;
          firstY = y;
          direction = '';
          flag = 1;
        }
        break;
      case 'right':
        if (firstY + 1 === y) {
          flag++;
        } else {
          firstX = x;
          firstY = y;
          direction = '';
          flag = 1;
        }
        break;
      case 'top':
        if (firstX - 1 === x) {
          flag++;
        } else {
          firstX = x;
          firstY = y;
          direction = '';
          flag = 1;
        }
        break;
      case 'bottom':
        if (firstX + 1 === x) {
          flag++;
        } else {
          firstX = x;
          firstY = y;
          direction = '';
          flag = 1;
        }
        break;
      default:
        // 横向
        if (x === firstX && y !== firstY) {
          if (firstY + 1 === y) {
            direction = 'right';
            flag++;
          } else if (firstY - 1 === y) {
            direction = 'left';
            flag++;
          } else {
            direction = '';
            flag = 1;
          }
        }
        // 纵向
        else if (y === firstY && x !== firstX) {
          if (firstX + 1 === x) {
            direction = 'bottom';
            flag++;
          } else if (firstX - 1 === x) {
            direction = 'top';
            flag++;
          } else {
            direction = '';
            flag = 1;
          }
        } else {
          direction = '';
          flag = 1;
        }
        firstX = x;
        firstY = y;
        break;
    }

    if (flag === max) {
      break;
    }
    index++;
  }
  return flag === max;
}
