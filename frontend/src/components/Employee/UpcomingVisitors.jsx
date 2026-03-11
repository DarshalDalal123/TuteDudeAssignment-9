import { useFetch } from '../../hooks/useFetch';

export const UpcomingVisitors = () => {
  const { data: upcomingVisitorsData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/employee/upcoming-visitors`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(upcomingVisitorsData);
  return (
    <div>UpcomingVisitors</div>
  )
}