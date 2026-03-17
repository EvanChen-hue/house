import { Typography } from "antd";

export default function PageHeader({ title, subtitle, extra }) {
  return (
    <div className="hk-pageHead">
      <div>
        <Typography.Title level={3} className="hk-pageHeadTitle">
          {title}
        </Typography.Title>
        {subtitle ? <div className="hk-pageHeadSub">{subtitle}</div> : null}
      </div>
      {extra}
    </div>
  );
}

