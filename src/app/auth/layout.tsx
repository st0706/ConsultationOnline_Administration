import { Logo } from "@/components/layout";
import { Center, Stack } from "@mantine/core";
import { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Center
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "48px 0"
      }}>
      <Stack>
        <Center>
          <Logo />
        </Center>
        {children}
      </Stack>
    </Center>
  );
}

export default AuthLayout;
