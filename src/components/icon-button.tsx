import * as React from "react";
import { Button } from "@/components/ui/button";

export function IconButton(props: React.ComponentProps<typeof Button>) {
  return <Button size="icon-sm" variant="outline" {...props} />;
}
