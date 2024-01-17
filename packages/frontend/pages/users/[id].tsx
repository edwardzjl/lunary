import { useRouter } from "next/router"

import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"

import SmartViewer from "@/components/SmartViewer"

import AgentSummary from "@/components/Analytics/AgentSummary"
import UsageSummary from "@/components/Analytics/UsageSummary"
import AppUserAvatar from "@/components/Blocks/AppUserAvatar"
import CopyText from "@/components/Blocks/CopyText"
import { useProjectSWR, useRunsUsage } from "@/utils/dataHooks"
import {
  costColumn,
  durationColumn,
  feedbackColumn,
  inputColumn,
  nameColumn,
  outputColumn,
  tagsColumn,
  timeColumn,
} from "@/utils/datatable"
import { formatAppUser } from "@/utils/format"
import { NextSeo } from "next-seo"

const columns = [
  timeColumn("createdAt"),
  nameColumn("Name"),
  durationColumn(),
  costColumn(),
  feedbackColumn(),
  tagsColumn(),
  inputColumn("Prompt"),
  outputColumn("Result"),
]

export default function UserDetails({}) {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const { data: user } = useProjectSWR(`/external-users/${id}`)

  // TODO
  // const { runs, loading, validating, loadMore } = useRuns(undefined, {
  //   match: { user: id }, //, parentRun: undefined },
  //   filter: ["parentRun", "is", "null"],
  // })

  const { usage } = id ? useRunsUsage(90, id) : { usage: undefined }

  const { name, email, ...extraProps } = user?.props || ({} as any)

  return (
    <Stack>
      <NextSeo title={formatAppUser(user)} />

      <Card withBorder>
        <Group gap={48}>
          <Group>
            <AppUserAvatar user={user} />
            <Title order={4}>{formatAppUser(user)}</Title>
          </Group>
          <Group gap={3}>
            <Text>ID:</Text>
            <CopyText value={user?.externalId} />
          </Group>
          {email && (
            <Group gap={3}>
              <Text>Email:</Text>
              <CopyText value={email} />
            </Group>
          )}
          <Group>
            {user?.last_seen && (
              <Text c="dimmed">{`last seen:  ${new Date(
                user.last_seen,
              ).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}`}</Text>
            )}
          </Group>

          {Object.keys(extraProps).length > 0 && (
            <SmartViewer data={extraProps} />
          )}
        </Group>
      </Card>
      <Title order={2}>Analytics</Title>
      {usage && (
        <SimpleGrid cols={3} spacing="md">
          <UsageSummary usage={usage} />
          <AgentSummary usage={usage} />
        </SimpleGrid>
      )}

      {/* <Title order={2}>Latest Activity</Title> */}
      {/* 
      <DataTable
        type="user-details"
        data={runs}
        columns={columns}
        loading={loading || validating}
        loadMore={loadMore}
        onRowClicked={(row) => {
          router.push(`/traces/${row.id}`)
        }}
      /> */}
    </Stack>
  )
}
