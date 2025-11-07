import os

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "src")

# --- Páginas Vendor (sin sufijo) ---
vendor_pages = {
    "pages/vendor/Apps.tsx": """import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import type { App } from '../../types/types';

export default function Apps() {
  const queryClient = useQueryClient();
  const { data: apps = [] } = useQuery<App[]>({ queryKey: ['vendorApps'], queryFn: api.getVendorApps });
  const deleteMutation = useMutation({
    mutationFn: api.deleteApp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendorApps'] })
  });

  return (
    <>
      <Typography variant="h5">Mis Apps</Typography>
      <List>
        {apps.map(a => (
          <ListItem key={a.id} secondaryAction={<Button color="error" onClick={() => deleteMutation.mutate(a.id)}>Eliminar</Button>}>
            <ListItemText primary={a.name} secondary={a.desc} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
""",

    "pages/vendor/AppStats.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Typography } from '@mui/material';

interface Props { appId?: number; }

export default function AppStats({ appId }: Props) {
  if (appId === undefined) return <Typography variant="h5">Seleccione una App</Typography>;

  const { data } = useQuery({ queryKey: ['appStats', appId], queryFn: () => api.getAppStats(appId) });
  return <Typography variant="h5">Estadísticas App<pre>{JSON.stringify(data, null, 2)}</pre></Typography>;
}
""",

    "pages/vendor/AppReviews.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import type { Review } from '../../types/types';

interface Props { appId?: number; }

export default function AppReviews({ appId }: Props) {
  if (appId === undefined) return <Typography variant="h5">Seleccione una App</Typography>;

  const { data: reviews = [] } = useQuery<Review[]>({ queryKey: ['appReviews', appId], queryFn: () => api.getAppReviews(appId) });
  return (
    <>
      <Typography variant="h5">Reseñas de la App</Typography>
      <List>
        {reviews.map(r => <ListItem key={r.id}><ListItemText primary={r.text} /></ListItem>)}
      </List>
    </>
  );
}
""",

    "pages/vendor/Payments.tsx": """import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import type { Payment } from '../../types/types';

export default function Payments() {
  const queryClient = useQueryClient();
  const { data: payments = [] } = useQuery<Payment[]>({ queryKey: ['vendorPayments'], queryFn: api.getPayments });
  const confirmPayment = useMutation({
    mutationFn: api.confirmPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendorPayments'] })
  });

  return (
    <>
      <Typography variant="h5">Pagos Recibidos</Typography>
      <List>
        {payments.map(p => (
          <ListItem key={p.id} secondaryAction={<Button onClick={() => confirmPayment.mutate(p.id)}>Confirmar Pago</Button>}>
            <ListItemText primary={`$${p.amount}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
""",

    "pages/vendor/Recommendations.tsx": """import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function Recommendations() {
  const { data: recs = [] } = useQuery({ queryKey: ['vendorRecs'], queryFn: api.getVendorRecommendations });
  return (
    <>
      <Typography variant="h5">Recomendaciones Inteligentes</Typography>
      <List>
        {recs.map((r: string, i: number) => <ListItem key={i}><ListItemText primary={r} /></ListItem>)}
      </List>
    </>
  );
}
"""
}

# --- Crear archivos Vendor ---
for path, content in vendor_pages.items():
    file_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado/actualizado: {file_path}")

# --- Generar archivo único de rutas Vendor con Layout + Outlet ---
routes_path = os.path.join(BASE_DIR, "pages/vendor/routes.tsx")

imports = [
    "import React from 'react';",
    "import type { RouteObject } from 'react-router-dom';",
    "import LayoutVendor from '../../components/LayoutVendor';"
]

# importar todos los componentes
for file_path in vendor_pages.keys():
    comp_name = os.path.splitext(os.path.basename(file_path))[0]
    imports.append(f"import {comp_name} from './{comp_name}';")

# rutas jerárquicas bajo LayoutVendor con children
routes_lines = [
    "",
    "export const vendorRoutes: RouteObject[] = [",
    "  {",
    "    path: '/vendor',",
    "    element: <LayoutVendor />,",
    "    children: [",
    "      { path: 'apps', element: <Apps /> },",
    "      { path: 'apps/stats', element: <AppStats /> },",
    "      { path: 'apps/reviews', element: <AppReviews /> },",
    "      { path: 'payments', element: <Payments /> },",
    "      { path: 'recommendations', element: <Recommendations /> },",
    "    ],",
    "  },",
    "];",
    "",
    "export default vendorRoutes;"
]

with open(routes_path, "w", encoding="utf-8") as f:
    f.write("\n".join(imports + routes_lines))

print(f"✅ Archivo de rutas Vendor actualizado con Layout + Outlet: {routes_path}")

# --- Eliminar duplicados antiguos (vendorRoutes.tsx) si existían ---
old_file = os.path.join(BASE_DIR, "pages/vendor/vendorRoutes.tsx")
if os.path.exists(old_file):
    os.remove(old_file)
    print(f"🧹 Eliminado duplicado antiguo: {old_file}")

print("\n🎉 Archivo de rutas Vendor adaptado a la nueva estructura con Layout y Outlet listo")
