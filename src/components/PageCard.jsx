/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2026-03-17 19:28:18
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2026-03-17 19:34:35
 * @FilePath: \house\src\components\PageCard.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card } from "antd";

export default function PageCard({ children }) {
  return (
    <Card className="hk-card" variant="outlined">
      {children}
    </Card>
  );
}

