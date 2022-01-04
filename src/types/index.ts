/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 13:58:29
 * @Description
 */

interface Options {
  /**
   * 字体颜色
   * @default 12px
   */
  fontSize: string;
  /**
   *  标尺颜色
   */
  mainColor: string;

  /**
   * 线条粗细
   */
  borderWidth: number;

  /**
   * 快捷键设置
   */
  shortcutKeys: {
    /**
     * 捕捉元素
     */
    catch: string;
  };
}
