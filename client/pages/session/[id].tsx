import { Sessions } from "@/components/Sessions";
import { useRouter } from "next/router";

const SessionsPage = ({ socket }: any) => {
  const router = useRouter();
  const { id, isNew, userName } = router.query;

  return (
    <div>
      <Sessions isNew={isNew} userName={userName} id={id} socket={socket} />
    </div>
  );
};

export default SessionsPage;
