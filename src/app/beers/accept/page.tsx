"use client"
import {
  BlockTitle,
  List,
  ListItem,
  Checkbox,
  Button,
  Block,
} from "konsta/react"
import { useState } from "react"

export default function AcceptBeerPage() {
  const [media, setMedia] = useState<string[]>([])
  const toggleMediaValue = (value: string) => {
    if (media.includes(value)) media.splice(media.indexOf(value), 1)
    else media.push(value)
    setMedia([...media])
  }

  return (
    <>
      <BlockTitle>With Media Lists</BlockTitle>
      <List strong inset>
        <ListItem
          label
          title="Facebook"
          after="17:14"
          subtitle="New messages from John Doe"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
          media={
            <Checkbox
              component="div"
              name="demo-media-checkbox"
              checked={media.includes("Item 1")}
              onChange={() => toggleMediaValue("Item 1")}
            />
          }
        />
        <ListItem
          label
          title="John Doe (via Twitter)"
          after="17:11"
          subtitle="John Doe (@_johndoe) mentioned you on Twitter!"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
          media={
            <Checkbox
              component="div"
              name="demo-media-checkbox"
              checked={media.includes("Item 2")}
              onChange={() => toggleMediaValue("Item 2")}
            />
          }
        />
      </List>
      <Block>
        <Button>Accept it</Button>
      </Block>
    </>
  )
}
