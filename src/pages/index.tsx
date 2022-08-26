import List from "src/shared/components/List";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { useAuth } from "src/modules/auth/auth.context";
import type { NextPage } from "next";
import Schedule from "src/shared/components/Schedule";
import { useQuery } from "@apollo/client";
import { FIND_TIMESLOTS_DETAILED } from "src/modules/timeslots/queries/find-timeslots-detailed.query";
import { PopulatedTimeslot } from "src/modules/timeslots/interfaces/timeslot.interface";
import LoadingSpinner from "src/shared/components/LoadingSpinner";

const Home: NextPage = () => {
  const { user } = useAuth();

  const findTimeslots = useQuery<{ timeslots: Array<PopulatedTimeslot> }>(
    FIND_TIMESLOTS_DETAILED,
    {
      variables: {
        where: {
          course: {
            participants_SOME: {
              uuid: user?.uuid || null,
            },
          },
        },
      },
    }
  );

  return (
    <DashboardLayout title={<>Welcome Back, {user?.firstname}!</>}>
      <List title="Your Schedule" hideViewSelector>
        {findTimeslots.loading || !findTimeslots.data ? (
          <LoadingSpinner />
        ) : (
          <Schedule
            weekRange={[0, 2]}
            timeslots={findTimeslots.data?.timeslots}
          />
        )}
      </List>
    </DashboardLayout>
  );
};

export default Home;
