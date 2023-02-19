import React from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { Sessions } from "@/components/Sessions";
import { useBeforeUnload } from "@/hooks/userBeforeUnload";
import { db } from "@/utils/firebase";

const roles = ["admin", "member"];

interface SessionPageProps {
  user: IUser;
  authorizedUser: boolean;
}

const SessionsPage = ({ user, authorizedUser }: SessionPageProps) => {
  const router = useRouter();
  const { id, isNew } = router.query;

  if (!authorizedUser)
    return (
      <h1 style={{ color: "#888", textAlign: "center" }}> Not Authorized </h1>
    );

  return (
    <div>
      <Sessions
        user={user}
        isNew={isNew === "true" ? true : (false as boolean)}
        id={id as string}
      />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { id, userName, role } = context.query;
  const sessionRef = doc(db, "sessions", id as string);
  const snap = await getDoc(sessionRef);
  const session = snap?.data() as ISession;
  const user =
    session &&
    (session?.users?.find((u: IUser) => u.userName === userName) as IUser);

  return {
    props: {
      authorizedUser: role === user?.type,
      user: user ?? {},
    },
  };
}

export default SessionsPage;
