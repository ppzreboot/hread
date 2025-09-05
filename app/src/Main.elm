port module Main exposing (main)

import Browser
import Html as H
import Html.Attributes as A
import Html.Events as E


port polly_ready : (Int -> msg) -> Sub msg
port synthesize_speech : String -> Cmd msg


type PollyState
    = PollyNotReady
    | PollyReady


type alias Model =
    { appError: Maybe String
    , pollyState : PollyState
    , text : String
    }

type Msg
    = UpdateText String
    | PollyLoaded
    | Synthesize


init : () -> ( Model, Cmd Msg )
init () =
    ( { appError = Nothing
      , pollyState = PollyNotReady
      , text = ""
      }
    , Cmd.none
    )


view : Model -> H.Html Msg
view model =
    H.div []
        [ H.textarea [ A.value model.text, E.onInput UpdateText ] []
        , H.button
            [ E.onClick Synthesize
            , A.disabled (model.pollyState /= PollyReady)
            ]
            [ H.text "Synthesize" ]
        ]

subscriptions : Model -> Sub Msg
subscriptions model =
    polly_ready (\_ -> PollyLoaded)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateText newText ->
            ( { model | text = newText }, Cmd.none )

        Synthesize ->
            case model.pollyState of
                PollyReady ->
                    ( model, synthesize_speech model.text )

                _ ->
                    ( model, Cmd.none )

        PollyLoaded ->
            ( { model | pollyState = PollyReady }, Cmd.none )



main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
