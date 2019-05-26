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
    private String translation;
}
