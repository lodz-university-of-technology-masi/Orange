package pl.masi.beans.alternative;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslatedQuestionBean {
    private String name;
    private String original;
    private List<String> choices;
    private String translation;
    private List<String> translatedChoices;
    private String questionType;
}
