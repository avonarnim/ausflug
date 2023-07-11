/* eslint-disable react-hooks/exhaustive-deps */
import { DialogProps } from "@mui/material";
import * as React from "react";

/**
 * @example
 export function Example(): JSX.Element {
   const dialog = useDialog(ProjectDialog);
   return (
     <React.Fragment>
       <Button onClick={dialog.open}>Create Project</Button>
       {dialog.component}
     </React.Fragment>
   );
 }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDialog<T extends React.FunctionComponent<any>>(
  component: T
) {
  const [state, setState] = React.useState<DialogProps>({ open: false });

  const open = React.useCallback((params?: Omit<Parameters<T>[0], "open">) => {
    setState((prev) => ({ ...prev, ...params, open: true }));
  }, []);

  const onClose = React.useCallback(
    (event: React.MouseEvent) => {
      state.onClose?.(event, "backdropClick");
      setState((prev) => ({ ...prev, open: false }));
    },
    [state.onClose]
  );

  const close = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, [state.onClose]);

  return React.useMemo(
    () => ({
      open,
      close,
      component: React.createElement(component, {
        ...state,
        onClose,
      }) as React.ReactElement<Parameters<T>[0]>,
    }),
    [open, state, component, onClose]
  );
}
