import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/cars/$carsId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/cars/$carsId"!</div>
}
