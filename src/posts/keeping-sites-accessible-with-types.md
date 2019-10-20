---toml
title = "Keeping Sites Accessible with Types"
layout = "talk-with-transcript"
date = 2019-10-16T12:00:00Z
tags = [
  "posts",
  "speaking",
  "html",
  "css",
  "a11y",
  "elm"
]
description= "Transcript and resources for a talk I gave at ClojuTre 2019."
videoId = "qyol-cB9IRE"
transcriptFilename = "src/transcripts/keeping-sites-accessible-with-types.txt"

[notistEmbed]
href = 'https://speaking.fotis.xyz/wdpPF3/keeping-sites-accessible-with-types'
notistId = "fotis/wdpPF3"
aspectRatio = "16x9"

[[interjections]]
slide = 10
type = "img"
  [interjections.data]
  alt = "Illustration of headings with outlines on a document, from h1 to h3."
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/7.jpg"

[[interjections]]
slide = 12
type = "img"
  [interjections.data]
  alt = "Illustration of form fields, with an example announcement of input names and type."
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/9.jpg"

[[interjections]]
slide = 18
type = "code"
  [interjections.data]
  language = "elm"
  content = """
hX : HeadingLevel -> List (Attribute msg) -> List (Html msg) -> Html msg
hX level =
    case level of
        H1 ->
            h1

        H2 ->
            h2

        H3 ->
            h3

        H4 ->
            h4

        H5 ->
            h5

        H6 ->
            h6
"""

[[interjections]]
slide = 19
type = "code"
  [interjections.data]
  language = "elm"
  content = """
heading : HeadingLevel -> List (Attribute msg) -> List (Html msg) -> Html msg
heading level attrs children =
    hX level (class "myHeading" :: attrs) children


subHeading : HeadingLevel -> List (Attribute msg) -> List (Html msg) -> Html msg
subHeading level attrs children =
    hX level (class "mySubHeading" :: attrs) children
"""

[[interjections]]
slide = 20
type = "code"
  [interjections.data]
  language = "elm"
  content = """
view : Model -> Html ()
view model =
  div []
    [ heading H1 [] [ text "Heading Demo" ]
    , nestedSection H2 "Hello"
    ]   

nestedSection : HeadingLevel -> String -> Html msg
nestedSection level demoData =
  div []
    [ subHeading level [] [ text "Data" ]
    , p [] [ text "This is a section about data." ]
    
    -- Propagate the heading level + 1
    , subHeading (incrementLevel level) [] [ text "Count" ]
    , p [] [ text demoData ]
    ]
"""

[[interjections]]
slide = 22
type = "code"
  [interjections.data]
  language = "elm"
  content = """
type
  InputLabelMethod
  -- Label contains the input + text
  = EmbeddedLabel String
  --Label is assocciated with a DOM id
  | LabelledById DomId


type DomId
    = DomId String


domIdToString (DomId idRef) =
    idRef
"""

[[interjections]]
slide = 22
type = "code"
  [interjections.data]
  language = "elm"
  content = """
-- Creating an input
input : InputLabelMethod -> List (Attribute msg) -> List (Html msg) -> Html msg
input labelMethod attrs children =
    case labelMethod of
        EmbeddedLabel labelText ->
            label []
                [ text labelText
                , Html.input attrs children
                ]

        LabelledById (DomId idRef) ->
            Html.input
                (id idRef :: attrs)
                children


inputLabel : DomId -> List (Attribute msg) -> List (Html msg) -> Html msg
inputLabel idRef attrs children =
    label (for (domIdToString idRef) :: attrs) children
"""

[[interjections]]
slide = 23
type = "code"
  [interjections.data]
  language = "elm"
  content = """
-- In use
nameLabelId =
  DomId "nameLabel"

view : Model -> Html ()
view model =
  div []
    [ input (EmbeddedLabel "Email") [ attribute "type" "email ] []
    , inputLabel nameLabelId [] [text "Name"]
    , input (LabelledById nameLabelId) [ attribute "type" "text" ] []
    ]
"""

[[interjections]]
slide = 25
type = "img"
  [interjections.data]
  alt = "In this codebase, we care about labels"
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/26.png"

[[interjections]]
slide = 26
type = "code"
  [interjections.data]
  language = "elm"
  content = """
type Purpose
    = Decorative
    | Content String


img : Purpose -> List (Attribute msg) -> Html msg
img purpose attrs =
    case purpose of
        Decorative ->
            Html.img 
            	((alt "") :: attrs) []

        Content description ->
            Html.img 
            	((alt description) :: attrs) []
"""

[[interjections]]
slide = 26
type = "code"
  [interjections.data]
  language = "elm"
  content = """
view =
    div []
        [ -- Ok
          img Decorative [ src "/kitten.jpg" ]
        , img (Content "The top of some colored buildings lit by sunset.") [ src "/sunset.jpg" ]
        , -- Error! Expected "Purpose"
          img [ src "/error.jpg" ]
        ]
"""

[[interjections]]
slide = 30
type = "code"
  [interjections.data]
  language = "elm"
  content = """
-- Creating a reusable image/icon
homeIcon : Purpose -> List (Attribute msg) -> Html msg
homeIcon purpose attrs =
    svgImg purpose attrs 
        [ polyline [ points "21 8 21 21 3 21 3 8" ] []
        , rect [ x "1", y "3", width "22", height "5" ] []
        , line [ x1 "10", y1 "12", x2 "14", y2 "12" ] []
        ]
"""

[[interjections]]
slide = 31
type = "code"
  [interjections.data]
  language = "elm"
  content = """
-- In use
view model =
    nav [] [
      a [href "/"] [homeIcon (Content "Home") []],
      a [href "/entries"] [
        homeIcon Decorative [], 
        text "Home"
     ]
    ]
"""

[[interjections]]
slide = 32
type = "code"
  [interjections.data]
  language = "typescript"
  content = """
type Purpose =
  | {type: 'decorative'}
  | {type: 'standalone', label: string}

const Decorative = (): Purpose => ({type: 'decorative'});
const Standalone = (label: string): Purpose => ({type: 'standalone', label});

interface IconProps extends SVGAttributes<SVGElement> {
  purpose: Purpose;
  color?: string;
  size?: string | number;
}
"""

[[interjections]]
slide = 27
type = "img"
  [interjections.data]
  alt = "What is my purpose?"
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/29.png"

[[interjections]]
slide = 33
type = "img"
  [interjections.data]
  alt = "Types will not solve everything..."
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/34.png"

[[interjections]]
slide = 35
type = "img"
  [interjections.data]
  alt = "Types can help make the work visible"
  aspectRatio = "16x9"
  src = "/img/posts/keeping-sites-accessible-with-types/37.png"
---

This is an enhanced transcript for a talk I gave at ClojuTre 2019. I have included relevant graphics and code snippets. Clicking on the timestamps in the transcript will play the video at that specific time.

## Topic

Accessibility on the web takes effort. The responsibility is split amongst development, design, and really anything that touches the product. On development and design, many of the common issues (color contrast, semantic markup and forms) have known practices and patterns.

However, there is a problem: HTML is permissive of anything and the semantic patterns often require expertise and research. On a bad day, or a tight deadline, even the most diligent person can miss things.

The rise of typed functional languages on the frontend affords us an opportunity. We have a chance to encode the values of accessibility in our system, in a way that our coworkers and future selves can avoid these issues automatically, as well as learn about them in a practical way.

In this talk, I will give a brief introduction to web accessibility, as well as concrete examples that help preserve it in our codebases. After the talk, I hope you’ll have issues for your backlog, as well as the confidence to tackle them!
