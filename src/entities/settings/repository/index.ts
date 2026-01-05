import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addContactsApi,
  deleteFiscalizedDevice,
  deletePaymentProvider,
  deleteTelegramBot,
  getAllBot,
  getAllConfigBot,
  postCashRegisterArca,
  postCashRegisterEPos,
  postCashRegisterHippoPos,
  postCashRegisterSimurg,
  postClick,
  postPayme,
  sendContactsApi,
  updateCashRegisterArca,
  updateCashRegisterEPos,
  updateCashRegisterHippoPos,
  updateCashRegisterSimurg,
  updateFiscalizationWhite,
  updatePaymentClick,
  updatePaymentPayme,
  updateSettings,
  updateSettingsShift,
} from "../api";

// UPDATE
export const useUpdateArca = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCashRegisterArca(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useUpdateSimurg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCashRegisterSimurg(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useUpdateHippoPos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCashRegisterHippoPos(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useUpdateEPos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCashRegisterEPos(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useUpdatePaymentPay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updatePaymentPayme(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-provider"] });
    },
  });
};

export const useUpdatePaymentClick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updatePaymentClick(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-provider"] });
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["init-settings"] });
    },
  });
};

export const useUpdateSettingsShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => updateSettingsShift(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["init-settings"] });
      queryClient.invalidateQueries({ queryKey: ["last-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shift"] });
    },
  });
};

export const useUpdateFiscalizationWhite = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => updateFiscalizationWhite(payload),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["init-settings"] });
    // },
  });
};

// CTREATE
export const useCreateArca = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postCashRegisterArca(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useCreateSimurg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postCashRegisterSimurg(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useCreateEPos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postCashRegisterEPos(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useCreateHippoPos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postCashRegisterHippoPos(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useCreatePayme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postPayme(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-provider"] });
    },
  });
};

export const useCreateClick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => postClick(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-provider"] });
    },
  });
};

// DELETE
export const useDeleteFiscalized = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFiscalizedDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscalized"] });
    },
  });
};

export const useDeletePaymentProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePaymentProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-provider"] });
    },
  });
};


// TELEGRAM BOT 
export const useAllBotApi = () => {
  return useQuery({
    queryKey: ["all-bot"],
    queryFn: getAllBot,
  });
};

export const useAllBotConfigApi = () => {
  return useQuery({
    queryKey: ["all-bot-config"],
    queryFn: getAllConfigBot,
  });
};

export const useSendContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => sendContactsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bot-config"] });
    },
  });
};

export const useAddContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => addContactsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bot"] });
    },
  });
};

export const useDeleteTelegramBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTelegramBot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bot"] });
    },
  });
};