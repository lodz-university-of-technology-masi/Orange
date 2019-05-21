package pl.masi.beans;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionTranslationBean {
    private String content;
    private String languageName;
}
