import os

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "src")

# --- Páginas Buyer ---
buyer_pages = {
    "pages/buyer/Apps.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import type { App } from '../../types/types';

export default function Apps() {
  const { data: apps = [] } = useQuery<App[]>({ queryKey: ['buyerApps'], queryFn: api.getBuyerApps });
  return (
    <>
      <Typography variant="h5">Apps Disponibles</Typography>
      <List>
        {apps.map(a => (
          <ListItem key={a.id}>
            <ListItemText primary={a.name} secondary={a.desc} />
            <Button onClick={() => api.executeApp(a.id)}>Usar App</Button>
          </ListItem>
        ))}
      </List>
    </>
  );
}
""",
    "pages/buyer/Payments.tsx": """import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Button, Typography } from '@mui/material';
import type { Payment } from '../../types/types';

export default function Payments() {
  const queryClient = useQueryClient();

  const payMutation = useMutation({
    mutationFn: (variables: { amount: number }) => api.makePayment(variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buyerPayments'] }),
  });

  return (
    <div>
      <Typography variant="h5">Realizar Pago por QR</Typography>
      <Button onClick={() => payMutation.mutate({ amount: 100 })}>
        Pagar $100
      </Button>
    </div>
  );
}
""",
    "pages/buyer/Recommendations.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function Recommendations() {
  const { data: recs = [] } = useQuery({ queryKey: ['buyerRecs'], queryFn: api.getBuyerRecommendations });
  return (
    <>
      <Typography variant="h5">Recomendaciones Inteligentes</Typography>
      <List>
        {recs.map((r: string, i: number) => <ListItem key={i}><ListItemText primary={r} /></ListItem>)}
      </List>
    </>
  );
}
""",
    "pages/buyer/Reviews.tsx": """import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { TextField, Button, Typography } from '@mui/material';
import type { Review } from '../../types/types';

interface Props { appId?: number; }

export default function Reviews({ appId }: Props) {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: ({ appId, text }: { appId: number; text: string }) =>
      api.submitReview({ appId, text }),
    onSuccess: () => {
      setText('');
      if (appId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['buyerReviews', appId] });
      }
    },
  });

  const handleSubmit = () => {
    if (appId !== undefined) submitMutation.mutate({ appId, text });
  };

  return (
    <div>
      <Typography variant="h5">Dejar Reseña</Typography>
      <TextField value={text} onChange={e => setText(e.target.value)} fullWidth />
      <Button onClick={handleSubmit} disabled={appId === undefined}>Enviar</Button>
    </div>
  );
}
""",
    "pages/buyer/Purchases.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import type { App } from '../../types/types';

export default function Purchases() {
  const { data: purchases = [] } = useQuery<App[]>({ queryKey: ['buyerPurchases'], queryFn: api.getBuyerPurchases });
  return (
    <>
      <Typography variant="h5">Apps Compradas</Typography>
      <List>
        {purchases.map(a => <ListItem key={a.id}><ListItemText primary={a.name} secondary={a.desc} /></ListItem>)}
      </List>
    </>
  );
}
"""
}

# --- Crear o actualizar archivos Buyer ---
for path, content in buyer_pages.items():
    file_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado/actualizado: {file_path}")

# --- Generar archivo único de rutas Buyer con Layout + Outlet ---
routes_path = os.path.join(BASE_DIR, "pages/buyer/routes.tsx")

imports = [
    "import React from 'react';",
    "import type { RouteObject } from 'react-router-dom';",
    "import LayoutBuyer from '../../components/LayoutBuyer';"
]

# importar todos los componentes
for file_path in buyer_pages.keys():
    comp_name = os.path.splitext(os.path.basename(file_path))[0]
    imports.append(f"import {comp_name} from './{comp_name}';")

# rutas jerárquicas bajo LayoutBuyer con children
routes_lines = [
    "",
    "export const buyerRoutes: RouteObject[] = [",
    "  {",
    "    path: '/buyer',",
    "    element: <LayoutBuyer />,",
    "    children: [",
    "      { path: 'apps', element: <Apps /> },",
    "      { path: 'payments', element: <Payments /> },",
    "      { path: 'recommendations', element: <Recommendations /> },",
    "      { path: 'reviews', element: <Reviews /> },",
    "      { path: 'purchases', element: <Purchases /> },",
    "    ],",
    "  },",
    "];",
    "",
    "export default buyerRoutes;"
]

with open(routes_path, "w", encoding="utf-8") as f:
    f.write("\n".join(imports + routes_lines))

print(f"✅ Archivo de rutas Buyer actualizado con Layout + Outlet: {routes_path}")

# --- Eliminar duplicados antiguos (buyerRoutes.tsx) si existían ---
old_file = os.path.join(BASE_DIR, "pages/buyer/buyerRoutes.tsx")
if os.path.exists(old_file):
    os.remove(old_file)
    print(f"🧹 Eliminado duplicado antiguo: {old_file}")

print("\n🎉 Archivo de rutas Buyer adaptado a la nueva estructura con Layout y Outlet listo")
