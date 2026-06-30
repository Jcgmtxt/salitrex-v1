import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/cars/$carId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/cars/$carId"!</div>
}
