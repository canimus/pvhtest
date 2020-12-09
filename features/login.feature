Feature: Events optimizely

    @Mock
    Scenario: Landing Page
        Given I am in TH site
        When I inspect the landing events
        Then I see an event with a valid schema


    @NoMock
    Scenario: Langing Site
        Given I am in TH site
        When I inspect the landing events
        Then I pass parameters
            | element | value |
            | a       | 1     |
            | b       | 2     |
        Then I see an event with a valid schema